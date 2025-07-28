import React, { useState, useEffect } from "react"

function App() {
  const [gamesData, setGamesData] = useState([]) // State to hold the fetched games data
  const [loading, setLoading] = useState(true) // State to manage loading status
  const [error, setError] = useState(null) // State to manage any fetching errors

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedFocus, setSelectedFocus] = useState("")
  const [minPlayers, setMinPlayers] = useState("")
  const [expandedGames, setExpandedGames] = useState({}) // State to manage expanded descriptions

  // Effect to fetch the JSON data when the component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Assuming impro_games_cleaned.json is in the public folder or accessible path
        const response = await fetch("impro_games_cleaned.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setGamesData(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, []) // Empty dependency array means this effect runs once on mount

  // Extract unique categories, focuses, and max players for filters
  // These should only be calculated once the data is loaded
  const categories = [
    ...new Set(gamesData.map((game) => game.kategoria)),
  ].sort()
  const focuses = [
    ...new Set(gamesData.map((game) => game.glowny_fokus)),
  ].sort()
  const maxPlayers =
    gamesData.length > 0
      ? Math.max(...gamesData.map((game) => game.minimalna_liczba_graczy))
      : 0
  const playerOptions = Array.from({ length: maxPlayers }, (_, i) => i + 1)

  // Filtered games based on search and filters
  const filteredGames = gamesData.filter((game) => {
    const matchesSearch =
      game.nazwa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.nazwa_ang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.opis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.opis_ang.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory
      ? game.kategoria === selectedCategory
      : true
    const matchesFocus = selectedFocus
      ? game.glowny_fokus === selectedFocus
      : true
    const matchesMinPlayers = minPlayers
      ? game.minimalna_liczba_graczy >= parseInt(minPlayers)
      : true

    return matchesSearch && matchesCategory && matchesFocus && matchesMinPlayers
  })

  // Toggle expanded state for a game
  const toggleExpand = (id) => {
    setExpandedGames((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 font-sans text-gray-800">
        <p className="text-2xl text-purple-700">Ładowanie danych...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 font-sans text-gray-800">
        <p className="text-2xl text-red-700">
          Wystąpił błąd podczas ładowania danych: {error}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 font-sans text-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .scroll-container {
          max-height: calc(100vh - 250px); /* Adjust based on header/filter height */
          overflow-y: auto;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
        `}
      </style>

      {/* Header */}
      <header className="text-center mb-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 mb-2">
          Katalog Gier Improwizacyjnych
        </h1>
        <p className="text-lg text-gray-600">
          Odkryj nowe gry improwizacyjne i znajdź inspirację!
        </p>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Szukaj gry:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Wpisz nazwę lub opis..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Kategoria:
          </label>
          <select
            id="category"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Main Focus Filter */}
        <div>
          <label
            htmlFor="focus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Główny Fokus:
          </label>
          <select
            id="focus"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white"
            value={selectedFocus}
            onChange={(e) => setSelectedFocus(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {focuses.map((foc) => (
              <option key={foc} value={foc}>
                {foc}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Players Filter */}
        <div>
          <label
            htmlFor="minPlayers"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Min. graczy:
          </label>
          <select
            id="minPlayers"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white"
            value={minPlayers}
            onChange={(e) => setMinPlayers(e.target.value)}
          >
            <option value="">Wszystkie</option>
            {playerOptions.map((num) => (
              <option key={num} value={num}>
                {num}+
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Game List */}
      <div className="scroll-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div
              key={game.nr_katalogowy}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-purple-500"
            >
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">
                {game.nazwa}
              </h2>
              {expandedGames[game.nr_katalogowy] && (
                <p className="text-gray-500 italic mb-2">({game.nazwa_ang})</p>
              )}
              <p className="text-gray-700 mb-4">{game.opis}</p>

              {expandedGames[game.nr_katalogowy] && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-purple-600 mb-2">
                    Szczegóły (EN):
                  </h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Nazwa EN:</strong> {game.nazwa_ang}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Opis EN:</strong> {game.opis_ang}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Kategoria: {game.kategoria}
                </span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  Fokus: {game.glowny_fokus}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Min. graczy: {game.minimalna_liczba_graczy}
                </span>
              </div>

              <button
                onClick={() => toggleExpand(game.nr_katalogowy)}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                {expandedGames[game.nr_katalogowy]
                  ? "Pokaż mniej"
                  : "Pokaż szczegóły (EN)"}
              </button>
            </div>
          ))
        ) : (
          <div className="md:col-span-3 text-center text-gray-600 text-xl p-8 bg-white rounded-xl shadow-md">
            Brak gier spełniających kryteria wyszukiwania.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
