import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.1/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Sign in with email
async function signInWithEmail() {
    try {
        const email = 'test@example.com' // You can change this email
        const password = 'test123456' // You can change this password

        // Try to sign in
        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        // If user doesn't exist, sign up
        if (error && error.message.includes('Invalid login credentials')) {
            console.log('User not found, creating new account...')
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (signUpError) {
                console.error('Error signing up:', signUpError)
                return false
            }

            data = signUpData
        } else if (error) {
            console.error('Error signing in:', error)
            return false
        }

        console.log('Successfully authenticated')
        return true
    } catch (error) {
        console.error('Authentication error:', error)
        return false
    }
}

// Prefill form data
const prefillData = {
    id: generateUUID(),
    destination: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    image_url: 'https://example.com/image65.jpg',
    price: 199,
    original_price: 751,
    discount: 104,
    departure: 'New York',  
    stops: 'Non-stop',
    is_hot: true,
    type: 'Economy',
    likes: 735,
    url: 'https://example.com/deal35',
    departure_time: '08:00',
    arrival_time: '12:00',
    flight_duration: '5h 30m',
    posted_by: 'Admin',
    posted_by_avatar: 'https://example.com/avatar21.jpg',
    posted_by_description: 'Luxury seeker'
}

// Function to prefill the form
function prefillForm() {
    try {
        console.log('Prefilling form...')
        const form = document.getElementById('dealForm')
        if (!form) {
            console.error('Form not found!')
            return
        }

        Object.entries(prefillData).forEach(([key, value]) => {
            const input = form.elements[key]
            if (input) {
                if (input.type === 'select-one') {
                    input.value = value.toString()
                } else if (input.type === 'checkbox') {
                    input.checked = value
                } else if (input.type === 'date') {
                    input.value = value
                } else {
                    input.value = value
                }
                console.log(`Set ${key} to ${value}`)
            } else {
                console.warn(`Input for ${key} not found`)
            }
        })
        console.log('Form prefilled successfully')
    } catch (error) {
        console.error('Error prefilling form:', error)
    }
}

document.getElementById('dealForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log('Form submission started')

    try {
        // Ensure we're authenticated
        const isAuthenticated = await signInWithEmail()
        if (!isAuthenticated) {
            alert('Error: Could not authenticate')
            return
        }

        const formData = new FormData(e.target)
        const data = {
            id: formData.get('id') || generateUUID(),
            destination: formData.get('destination'),
            country: formData.get('country'),
            flag: formData.get('flag'),
            image_url: formData.get('image_url'),
            price: parseInt(formData.get('price')),
            original_price: parseInt(formData.get('original_price')),
            discount: parseInt(formData.get('discount')),
            departure: formData.get('departure'),
            stops: formData.get('stops'),
            is_hot: formData.get('is_hot') === 'true',
            type: formData.get('type'),
            likes: parseInt(formData.get('likes')),
            created_at: new Date().toISOString(),
            url: formData.get('url'),
            departure_time: formData.get('departure_time'),
            arrival_time: formData.get('arrival_time'),
            flight_duration: formData.get('flight_duration'),
            posted_by: formData.get('posted_by'),
            posted_by_avatar: formData.get('posted_by_avatar'),
            posted_by_description: formData.get('posted_by_description')
        }

        console.log('Submitting data:', data)

        // Get the current user's ID
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('No authenticated user found')
        }
        
        // Add the user_id to the data
        // Removed this line as per the instruction
        // data.user_id = user.id

        const { error } = await supabase
            .from('deals')
            .insert([data])

        if (error) throw error

        console.log('Deal submitted successfully')
        alert('Deal submitted successfully!')
        
        // Generate new UUID for the form
        const idInput = document.querySelector('input[name="id"]')
        if (idInput) {
            idInput.value = generateUUID()
        }
        
        // Reset other form fields
        e.target.reset()
        
        // Refresh the deals display
        await displayDeals()
    } catch (error) {
        console.error('Error in form submission:', error)
        alert('Error submitting deal: ' + error.message)
    }
})

async function displayDeals() {
    try {
        console.log('Fetching deals...')
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        if (error) {
            console.error('Error fetching deals:', error)
            throw error
        }

        console.log('Deals fetched:', data)

        const dealsList = document.getElementById('dealsList')
        if (!dealsList) {
            console.error('Deals list element not found!')
            return
        }

        dealsList.innerHTML = ''
        
        if (data.length === 0) {
            dealsList.innerHTML = '<p>No deals found</p>'
            return
        }
        
        data.forEach(deal => {
            const div = document.createElement('div')
            div.className = 'deal-item'
            div.innerHTML = `
                <div>
                    <strong>${deal.destination}, ${deal.country}</strong> ${deal.flag}<br>
                    Stops: ${deal.stops}<br>
                    Type: ${deal.type}
                </div>
                <div>
                    <strong>Price:</strong> $${deal.price} (Save $${deal.discount})<br>
                    <strong>Departure:</strong> ${new Date(deal.departure).toLocaleDateString()}<br>
                    <strong>Duration:</strong> ${deal.flight_duration}
                </div>
                <div>
                    <strong>Posted by:</strong> ${deal.posted_by}<br>
                    <strong>Likes:</strong> ${deal.likes}<br>
                    <a href="${deal.url}" target="_blank">View Deal</a>
                </div>
            `
            dealsList.appendChild(div)
        })
        console.log('Deals displayed successfully')
    } catch (error) {
        console.error('Error in displayDeals:', error)
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...')
    try {
        const authResult = await signInWithEmail()
        console.log('Authentication result:', authResult)
        
        prefillForm()
        await displayDeals()
        
        console.log('Initialization complete')
    } catch (error) {
        console.error('Error during initialization:', error)
    }
})
