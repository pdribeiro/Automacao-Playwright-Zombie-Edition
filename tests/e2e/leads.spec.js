// @ts-check
const { LandingPage } = require('../pages/LandingPage')
const {Toast} = require('../pages/Components')
const { faker } = require('@faker-js/faker')
const { test, expect } = require('@playwright/test')
const { openAsBlob } = require('fs')

let landingPage
let toast

let randomName
let randomEmail


test.beforeEach(async({page})=>{
  landingPage = new LandingPage(page)
  toast = new Toast(page)


})


test('deve cadastrar um lead na fila de espera', async ({ page }) => {

  const randomName = faker.person.fullName()
  const randomEmail = faker.internet.email()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm(randomName,randomEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'
  await toast.containText(message)

});

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {
  const randomName = faker.person.fullName()
  const randomEmail = faker.internet.email()

const newLead = await request.post('http://localhost:3333/leads',{
    data:{
      name:randomName,
      email:randomEmail
    }
  })

  expect(newLead.ok()).toBeTruthy()

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm(randomName,randomEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await toast.containText(message)

});

test('não deve cadastrar com email incorreto', async ({ page }) => {

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm('Pedro Franco','pedro.r.franco90gmail.com')

  await landingPage.alertHaveText('Email incorreto')

});


test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm('','pedro.r.franco90@gmail.com')

  await landingPage.alertHaveText('Campo obrigatório')

});


test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm('Pedro Franco','')

  await landingPage.alertHaveText('Campo obrigatório')

});

test('não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {

  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm('','')

  await landingPage.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório'

  ])


});