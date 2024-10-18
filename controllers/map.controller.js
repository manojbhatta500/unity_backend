const NodeGeocoder = require('node-geocoder');

const {
    LastLocation,
    AccCreatedLocation
} = require('../models/map_model');



const geocoder = NodeGeocoder({
    provider: 'openstreetmap',

  });


  async function lastlocation(req, res) {
    try {
        console.log('Mapper endpoint is working');

        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(404).json({
                status: "error",
                message: "Latitude and longitude are required"
            });
        }

        console.log(`The latitude and longitude are ${latitude}, ${longitude}`);
        console.log(`The user ID received is ${req.userid}`);

        const lastLocation = await LastLocation.findOneAndUpdate(
            { user_id: req.userid },  // Access req.userid, set by the middleware
            { 
                latitude: latitude, 
                longitude: longitude
            }, 
            { 
                new: true,   
                upsert: true 
            }
        );

        res.status(200).json({
            stat: true,
            locationData: lastLocation
        });
    } catch (e) {
        console.log(`The error is ${e}`);
        res.status(400).json({
            stat: false,
            message: "Something went wrong, try again."
        });
    }
}









module.exports = {
    lastlocation
};




// const result = await geocoder.reverse({ lat: latitude, lon: longitude });
//     // Send the nearest address back to the frontend
//     res.json({
//       location: result[0].formattedAddress, // relative location
//       accuracy: geolib.isPointWithinRadius(
//         { latitude, longitude },
//         { latitude: 40.712776, longitude: -74.005974 }, // some reference point (e.g., New York City)
//         100000 // distance in meters (100km in this example)
//       ),
//     });