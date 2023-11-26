const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    cors = require('cors'),
    router = require('./routes')


require('dotenv').config()
app.use(express.json({strict: false}))

app.use(cors())
app.use('/api/v1', router)


app.get('*', (req, res) => {
    return res.status(404).json({
        error: 'End point is not registered'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})
