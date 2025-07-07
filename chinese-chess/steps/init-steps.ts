import { Given, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';

Given('the system is ready', function () {
  this.systemReady = true;
});

Then('I should see {string}', function (expectedMessage: string) {
  assert.strictEqual(this.systemReady, true);
  assert.strictEqual(expectedMessage, 'System Ready');
});
