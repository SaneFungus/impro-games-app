import json

def fix_translations(file_path='impro_games_cleaned.json'):
    """
    Interactively iterates through JSON entries to allow for manual correction of Polish translations.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            games = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {file_path}.")
        return

    for i, game in enumerate(games):
        print("-" * 40)
        print(f"Game {i+1}/{len(games)}")
        print(f"ID: {game.get('nr_katalogowy', 'N/A')}")
        print(f"English Name: {game.get('nazwa_ang', 'N/A')}")
        print("\nEnglish Description:")
        print(game.get('opis_ang', 'N/A'))
        print("\nCurrent Polish Description:")
        print(game.get('opis', 'N/A'))
        print("-" * 40)

        new_opis = input("Enter new Polish description (or press Enter to keep current): ")

        if new_opis.strip():
            game['opis'] = new_opis.strip()
            print("Translation updated.")

        # Save progress after every 10 games
        if (i + 1) % 10 == 0:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(games, f, ensure_ascii=False, indent=2)
                print(f"\n*** Progress saved after {i+1} games. ***\n")
            except IOError as e:
                print(f"Could not write to file: {e}")
                # Decide how to handle this - maybe break or try again
                break


    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(games, f, ensure_ascii=False, indent=2)
        print("\nAll translations checked. Final file saved.")
    except IOError as e:
        print(f"Could not write final file: {e}")

if __name__ == '__main__':
    fix_translations()
