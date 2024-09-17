const {test, expect}= require('@playwright/test')

const {LoginPage} = require ('../pages/LoginPage')

let loginPage
test.beforeEach(({page})=>{
    loginPage = new LoginPage(page)
    
})

test('deve logar com adm',async ({page})=> {

await loginPage.visit()
await loginPage.submit('admin@zombieplus.com','pwd123')
await loginPage.isLoggedIn()

})