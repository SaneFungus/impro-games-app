from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Grant clipboard permissions
    context = browser.new_context(permissions=["clipboard-read", "clipboard-write"])
    page = context.new_page()

    try:
        page.goto("http://localhost:8000", timeout=60000)

        # Wait for games to load by waiting for the first card to be visible
        expect(page.locator(".game-card").first).to_be_visible(timeout=10000)

        # Select the first game
        first_game_card = page.locator(".game-card[data-id='1']")
        first_game_card.click()

        # Click the main export button to show the modal
        export_button = page.locator("#exportBtn")
        expect(export_button).to_be_visible()
        export_button.click()

        # Wait for the modal to be visible
        modal = page.locator("#exportModal")
        expect(modal).to_be_visible()

        # Check the 'Dołącz opisy' checkbox if not already checked
        desc_checkbox = page.locator("#includeDescription")
        if not desc_checkbox.is_checked():
            desc_checkbox.check()

        # Check the 'Pokaż angielskie nazwy i opisy' checkbox
        eng_checkbox = page.locator("#includeEnglish")
        eng_checkbox.check()

        # Take a screenshot of the modal after checking the boxes
        page.screenshot(path="jules-scratch/verification/verification.png")

        # Click the confirm export button in the modal
        modal_confirm_button = page.locator("#modalConfirmBtn")
        modal_confirm_button.click()

        # Wait for the success toast to appear
        toast = page.locator("#toast.show")
        expect(toast).to_be_visible()
        expect(toast).to_contain_text("Skopiowano 1 gier do schowka")

        # Read clipboard content
        clipboard_text = page.evaluate("async () => await navigator.clipboard.readText()")

        # Print the clipboard content for debugging
        print(f"Clipboard content: '{clipboard_text}'")

        # Assert that the correct English description is in the clipboard
        expected_description = "Get everyone in a big circle. One player starts by making a small gesture, perhaps with a little sound. His or her neighbor then tries and does exactly the same. And so on. Although we expect the gesture/sound not to change, it will. Notes: Pay attention to movements that suddenly switch left/right hand or leg. This shouldn't really happen, but it will. Once it happens, it should be accepted by the next player. Also watch/listen for little moans or sighs players might make before or after their turn - these should be taken on by the next player as well."

        assert expected_description in clipboard_text
        print("Clipboard content verified successfully.")

    finally:
        browser.close()
        context.close()

with sync_playwright() as playwright:
    run(playwright)
