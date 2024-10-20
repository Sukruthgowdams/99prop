// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJTWV2BDeszICaMHU6GrhyyiKvv_LR124",
    authDomain: "uiux-4c3c0.firebaseapp.com",
    databaseURL: "https://uiux-4c3c0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "uiux-4c3c0",
    storageBucket: "uiux-4c3c0.appspot.com",
    messagingSenderId: "695769170017",
    appId: "1:695769170017:web:fdd70537f234666bbfaa20",
    measurementId: "G-J96698JG3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add event listener for the form submission
document.getElementById('propertySearchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get user inputs
    const location = document.getElementById('locationInput').value.toLowerCase().replace(/\s+/g, '_').trim();
    const propertyType = document.getElementById('propertyType').value;
    const size = document.getElementById('size') ? document.getElementById('size').value : '';
    const availability = document.getElementById('availability') ? document.getElementById('availability').value : '';

    // Validate inputs
    if (!location || !propertyType) {
        alert("Please enter a valid location and select a property type.");
        return;
    }

    // Log user inputs for debugging
    console.log("User Inputs:", { location, propertyType, size, availability });

    // Fetch properties from the Firebase database
    fetchProperties(location, propertyType, size, availability);
});

function fetchProperties(location, propertyType, size, availability) {
    const propertiesRef = ref(db, `properties/${location}/${propertyType}`);

    // Log the reference path for debugging
    console.log("Database Reference Path:", propertiesRef.toString());

    get(propertiesRef).then((snapshot) => {
        // Log snapshot data for debugging
        console.log("Snapshot Data:", snapshot.val());

        let propertyHtml = '';

        if (snapshot.exists()) {
            const properties = snapshot.val();
            
            // Normalize the size input to lower case and trimmed format
            const normalizedSize = size.toLowerCase().trim();

            // Iterate over each property entry
            for (const key in properties) {
                const property = properties[key];

                // Normalize the property size to lower case and trimmed format
                const propertySize = property.size.toLowerCase().trim();

                // Adjust the checks based on your data structure
                if (
                    (!size || propertySize === normalizedSize) &&  // Check for exact match on size
                    (!availability || property.availability.toLowerCase() === availability.toLowerCase())
                ) {
                    propertyHtml += `
                        <div class="col-lg-4 col-md-6">
                            <div class="card property-card mb-4">
                                <img src="${property.image || 'default-image.jpg'}" class="card-img-top" alt="Property Image">
                                <div class="card-body">
                                    <h5 class="card-title">${property.size} ${propertyType}</h5>
                                    <p class="card-text">Location: ${property.location}</p>
                                    <p class="card-text">Price: ₹${property.price} lakhs</p>
                                    <p class="card-text">Availability: ${property.availability}</p>
                                    <p class="card-text">Total Sq Ft: ${property.total_sqft}</p>
                                    <p class="card-text">Bath: ${property.bath}</p>
                                    <p class="card-text">Balcony: ${property.balcony}</p>
                                    <a href="#" class="btn btn-primary">View Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            // If no properties match the filter criteria
            if (!propertyHtml) {
                propertyHtml = '<p>No properties found matching your criteria.</p>';
            }
        } else {
            propertyHtml = '<p>No properties found for the selected criteria.</p>';
        }

        document.getElementById('propertiesContainer').innerHTML = propertyHtml;
    }).catch((error) => {
        console.error("Error fetching properties: ", error.message);
        document.getElementById('propertiesContainer').innerHTML = '<p>Error fetching properties. Please try again later.</p>';
    });
}
