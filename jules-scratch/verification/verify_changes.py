import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the local server
        page.goto('http://localhost:8000/index.html')

        # Wait for all games to be loaded and rendered
        expect(page.locator('.game-card')).to_have_count(715, timeout=10000)

        # 1. Scroll down to test stickiness and bring a new game into view
        game_to_scroll_to = page.locator('.game-card[data-id="50"]')
        game_to_scroll_to.scroll_into_view_if_needed()
        page.wait_for_timeout(500) # Give it a moment for sticky positioning to settle

        # 2. Verify the tag change for a game that is now in view (e.g. #40)
        game_to_check = page.locator('.game-card[data-id="40"]')
        koncept_tag = game_to_check.locator('.game-tag:text-is("Koncept")')
        expect(koncept_tag).to_be_visible()

        # 3. Take a screenshot of the current viewport
        # This will show the sticky header/filters and the scrolled content
        page.screenshot(path='jules-scratch/verification/verification.png')

        browser.close()

if __name__ == "__main__":
    run_verification()
