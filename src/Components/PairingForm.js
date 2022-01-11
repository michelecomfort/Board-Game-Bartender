import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGameName } from '../redux/actions/boardGame'
import { setLiquorType } from '../redux/actions/liquorSearch'
import '../Styles/PairingForm.css'
import { useNavigate } from 'react-router'
import apiCalls from '../apiCalls'

const PairingForm = () => {

    const dispatch = useDispatch()
    let navigate = useNavigate()
    const [ error, setError ] = useState('')

    const games = useSelector(state => state.boardGame.allGamesData.games)
    const type = useSelector(state => state.liquorSearch.liquorSearchWord)
    const gameName = useSelector(state => state.boardGame.currentGameName)

    const gameNames = games.map((game) => {
        return (
            <option key={game.id} value={game.name} />
        )
    })

    const findRandomDrink = (event) => {
        event.preventDefault()
        apiCalls.getDrinkByType(type)
            .then(data => {
                if (data.drinks) {
                    let randomNum = Math.floor(Math.random() * data.drinks.length)
                    const drinkObj = data.drinks[randomNum]
                    const gameObj = games.find(game => game.name === gameName)
                    navigate(`/${gameObj.id}/${drinkObj.idDrink}`)
                } else {
                    setError(data.message)
                }
            })
    }

    return (
        <div className='loading-page-bottom'>
            <div className='circular-image'>
            <img src={require('../assets/games-drinks-friends.jpeg')} />
            </div>
            
            <form className='game-liquor-input pairing-form' data-cy='pairing-form'>
                <label htmlFor='game-choice' data-cy='pairing-form' className='game-input'>
                    
                    <input className='game-dropdown' data-cy='game-choice' id='game-choice' placeholder='Choose Your Game!' list='games' onChange={(event) => dispatch(setGameName(event.target.value))}/>
                        <datalist id='games'>
                            {gameNames}
                        </datalist>
                </label>
                <label htmlFor='liquor-choice' data-cy='pairing-form' className='liquor-input'>
                    
                    <input className ='liquor-dropdown' data-cy='liquor-choice' list='liquors' id='liquor-choice' placeholder='Whatchya drinking?' onChange={(event) => dispatch(setLiquorType(event.target.value))}/>
                    <datalist data-cy='liquor-choice' id='liquors' >
                        <option data-cy='liquor-choice' value='Vodka' />
                        <option value='Gin' />
                        <option value='Rum' />
                        <option value='Whiskey' />
                        <option value='Bourbon' />
                        <option value='Tequila' />
                        <option value='Scotch' />
                        <option value='Non Alcoholic' />
                    </datalist>

                </label>
                    <button className='pair-button' data-cy='pair-button' onClick={(event) => findRandomDrink(event)}><span>Pair</span></button>
                    <button className='favorites-button' data-cy='favorites-page-button' onClick={() => {navigate('/favorites')}}>Favorites</button>
            </form>

        </div>
    )
}

export default PairingForm