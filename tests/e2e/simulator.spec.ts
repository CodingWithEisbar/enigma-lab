import { expect, test } from '@playwright/test';

test('loads the simulator and generates a monthly codebook', async ({ page }) => {
  await page.goto('/');
  const simulator = page.frameLocator('iframe[title="Enigma Lab simulator"]');
  await expect(simulator.getByRole('tab', { name: /Bàn máy/i })).toBeVisible();
  await simulator.getByRole('tab', { name: /Codebook/i }).click();
  await simulator.getByRole('button', { name: /Sinh ngẫu nhiên cả tháng/i }).click();
  await expect(simulator.locator('#bookSetupStatus')).toContainText(/Đã sinh \d+ khóa ngày/i);
});

test('default vector encrypts HELLOWORLD', async ({ page }) => {
  await page.goto('/');
  const simulator = page.frameLocator('iframe[title="Enigma Lab simulator"]');
  await simulator.locator('#messageInput').fill('HELLOWORLD');
  await simulator.locator('#fastBtn').click();
  await expect(simulator.locator('#outputText')).toContainText('ILBDA AMTAZ');
});
