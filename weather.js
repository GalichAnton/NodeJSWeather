import { getArgs } from "./helpers/args.js"
import { getWeather,getIcon} from "./services/api.service.js"
import { printError, printHelp, printSuccess, printWeather } from "./services/logservice.js"
import { getKeyValue, saveKeyValue, TOKEN_DICTIONARY } from "./services/storage.service.js"

const saveToken = async (token) => {
  if (!token.length) {
    printError('Не передан токен')
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token)
    printSuccess('Токен сохранен')
  } catch (e) {
    printError(e.message)
  }
}

const saveCity = async (city) => {
  if (!city.length) {
    printError('Не передан город')
    return
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city)
    printSuccess('Город сохранен')
  } catch (e) {
    printError(e.message)
  }

}

const getForcast = async () => {
  try {
    const city = await getKeyValue(TOKEN_DICTIONARY.city)
    const weather = await getWeather(city)
    printWeather(weather,getIcon(weather.weather[0].icon))
  } catch (e) {
    if(e?.response?.status == 404){
      printError('Неверный город')
    } else if(e?.response?.status == 401){
      printError('Неверный токен')
    } else {
      printError(e.message + 'strange')
    }
  }
}

const initCLI = () => {
  const args = getArgs(process.argv)

  if (args.h) {
    printHelp()
  }
  if (args.s) {
    return saveCity(args.s)
  }
  if (args.t) {
    return saveToken(args.t)
  }
  getForcast()
}

initCLI()