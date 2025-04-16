import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3001/init');
  await page.getByRole('button', { name: 'Usuário' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).click();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('lorruan.terra@gmail.com');
  await page.getByRole('textbox', { name: 'E-mail' }).press('Tab');
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.goto('http://localhost:3001/user/app');
  await page.getByText('Objetivo65 kg').click();
  await page.getByRole('textbox', { name: 'Digite o valor' }).click();
  await page.getByRole('textbox', { name: 'Digite o valor' }).fill('64');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await page.locator('div').filter({ hasText: /^Perfil$/ }).click();
  await page.getByRole('button', { name: 'Sair' }).click();
  await page.getByRole('button', { name: 'Sim' }).click();
});