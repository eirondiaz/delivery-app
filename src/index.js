const app = require('./server')

app.listen(app.get('PORT'), () => {
    console.log(`Server listen on http://localhost:${app.get('PORT')}`)
})