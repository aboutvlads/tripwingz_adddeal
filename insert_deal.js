import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.1/+esm'

const SUPABASE_URL = 'https://vjaolwcexcjblstbsyoj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYW9sd2NleGNqYmxzdGJzeW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2NDQ3OTAsImV4cCI6MjA1MDIyMDc5MH0.ITA8YP8f1Yj_MJuyqr6GjFYGmhpnM5x5LGpw4sfbDJw'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const dealData = {
    deal_id: 469,
    city: 'Paris',
    country: 'France',
    flag: '🇺🇸',
    image_url: 'https://example.com/image65.jpg',
    original_price: 751,
    sale_price: 199,
    savings: 104,
    travel_date: '2024-02-15',
    flight_type: 'Non-stop',
    is_refundable: true,
    cabin_class: 'Economy',
    seats_left: 735,
    posted_date: '2023-12-22',
    deal_url: 'https://example.com/deal35',
    departure_time: '08:00',
    arrival_time: '12:00',
    duration: '5h 30m',
    posted_by: 'Admin',
    avatar_url: 'https://example.com/avatar21.jpg',
    user_type: 'Luxury seeker'
}

async function insertDeal() {
    try {
        const { data, error } = await supabase
            .from('deals')
            .insert([dealData])
            .select()

        if (error) {
            console.error('Error inserting deal:', error)
            return
        }

        console.log('Deal inserted successfully:', data)
    } catch (error) {
        console.error('Error:', error)
    }
}

insertDeal()
