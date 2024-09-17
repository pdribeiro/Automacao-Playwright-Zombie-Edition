// @ts-check
const { LandingPage } = require('../pages/LandingPage')
const { test, expect } = require('@playwright/test');
const { openAsBlob } = require('fs');

let landingPage

test.beforeEach(async({page})=>{
  landingPage = new LandingPage(page)


})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {


  await landingPage.visit()
  await landingPage.openLeadModal()
  await landingPage.subitLeadForm('Pedro Franco','pedro.r.franco90@gmail.com')

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'

  await landingPage.toastHaveText(message)


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