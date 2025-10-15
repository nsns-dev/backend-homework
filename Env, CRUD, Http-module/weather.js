import 'dotenv/config'
import readline from "node:readline"
import process from "node:process"
import Request from './Request.js'
import https from 'node:https'

const rl = readline.createInterface({input: process.stdin, output: process.stdout})
const weather_api = process.env.API_KEY_WEATHERSTACK

const req = new Request(rl, weather_api, process, https)
req.startApp()