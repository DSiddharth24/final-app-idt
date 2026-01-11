import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const iotSchema = z.object({
    device_id: z.string().uuid(),
    api_key: z.string(),
    rfid_uid: z.string(),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const validatedData = iotSchema.parse(body)

        const { device_id, api_key, rfid_uid } = validatedData

        const supabase = createClient()

        // 1. Validate device and API key
        const { data: device, error: deviceError } = await supabase
            .from('iot_devices')
            .select('id, zone_id')
            .eq('id', device_id)
            .eq('api_key', api_key)
            .single()

        if (deviceError || !device) {
            return NextResponse.json(
                { error: 'Unauthorized device' },
                { status: 401 }
            )
        }

        // 2. Map RFID to Worker
        const { data: rfidCard, error: rfidError } = await supabase
            .from('rfid_cards')
            .select('worker_id')
            .eq('rfid_uid', rfid_uid)
            .eq('is_active', true)
            .single()

        if (rfidError || !rfidCard) {
            return NextResponse.json(
                { error: 'Invalid or inactive RFID card' },
                { status: 404 }
            )
        }

        const worker_id = rfidCard.worker_id

        // 3. Check for active shift
        const { data: activeShift } = await supabase
            .from('shifts')
            .select('id, check_in_time')
            .eq('worker_id', worker_id)
            .is('check_out_time', null)
            .order('check_in_time', { ascending: false })
            .limit(1)
            .maybeSingle()

        let responseAction: 'CHECK-IN' | 'CHECK-OUT'

        if (activeShift) {
            // CHECK-OUT
            const checkOutTime = new Date()
            const checkInTime = new Date(activeShift.check_in_time)

            const durationMs =
                checkOutTime.getTime() - checkInTime.getTime()
            const durationHours = Number(
                (durationMs / (1000 * 60 * 60)).toFixed(2)
            )

            await supabase
                .from('shifts')
                .update({
                    check_out_time: checkOutTime.toISOString(),
                    total_hours: durationHours,
                })
                .eq('id', activeShift.id)

            await supabase.from('attendance_logs').insert({
                worker_id,
                device_id,
                rfid_uid,
                tap_type: 'OUT',
                timestamp: checkOutTime.toISOString(),
            })

            responseAction = 'CHECK-OUT'
        } else {
            // CHECK-IN
            const checkInTime = new Date()

            await supabase.from('shifts').insert({
                worker_id,
                zone_id: device.zone_id,
                check_in_time: checkInTime.toISOString(),
            })

            await supabase.from('attendance_logs').insert({
                worker_id,
                device_id,
                rfid_uid,
                tap_type: 'IN',
                timestamp: checkInTime.toISOString(),
            })

            responseAction = 'CHECK-IN'
        }

        return NextResponse.json({
            success: true,
            action: responseAction,
            worker_id,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request payload',
                    details: error.issues,
                },
                { status: 400 }
            )
        }

        console.error('IoT Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
