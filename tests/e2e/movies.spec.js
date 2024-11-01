const { test } = require('@playwright/test')

const data = require('../support/fixtures/movies.json')

const {executeSQl} = require('../support/database')

const { LoginPage } = require('../pages/LoginPage')
const {MoviesPage} = require('../pages/MoviesPage')
const { Toast } = require('../pages/Components')

let loginPage
let toast
let moviesPage

test.beforeEach(({ page }) => {
    loginPage = new LoginPage(page)
    moviesPage = new MoviesPage(page)
    toast = new Toast(page)

})

test('deve poder cadastrar um novo filme',async ({ page }) => {

    const movie = data.create

    await executeSQl(`DELETE from movies WHERE title = '${movie.title}';`)

    await loginPage.visit()
    await loginPage.submit('admin@zombieplus.com', 'pwd123')
    await moviesPage.isLoggedIn()

    await moviesPage.create(movie.title, movie.overview ,movie.company, movie.release_year)

    await toast.containText('Cadastro realizado com sucesso!')
})