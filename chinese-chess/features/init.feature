Feature: Initial Setup
  As a developer
  I want to verify the Cucumber setup
  So that I can proceed with BDD development

  @init
  Scenario: Verify Cucumber is running
    Given the system is ready
    Then I should see "System Ready"
