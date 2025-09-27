#!/usr/bin/env node
import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
	.command({
		command: 'add',
		desc: 'Добавить дни к текущей дате',
		builder: yargs => {
			return yargs.option('day', {
				alias: 'd',
				type: 'number',
				demandOption: true,
			})
		},
		handler: argv => {
			const date = new Date()
			date.setDate(+date.getDate() + argv.d)
			console.log(date.toLocaleString('ru-RU'))
		},
	})
	.command({
		command: 'sub',
		desc: 'Вычесть месяцы из текущей даты',
		builder: yargs => {
			return yargs.option('month', {
				alias: 'm',
				type: 'number',
				demandOption: true,
			})
		},
		handler: argv => {
			const date = new Date()
			date.setMonth(date.getMonth() - argv.m)
			console.log(date.toLocaleString('ru-RU'))
		},
	})
	.command({
		command: '$0',
		desc: 'Показать текущую дату',
		builder: yargs => {
			return yargs
				.option('year', {
					alias: 'y',
					type: 'boolean',
				})
				.option('month', {
					alias: 'm',
					type: 'boolean',
				})
				.option('date', {
					alias: 'd',
					type: 'boolean',
				})
		},
		handler: argv => {
			const date = new Date()
			const options =
				argv.year || argv.y
					? { year: 'numeric' }
					: argv.month || argv.m
					? { month: "long" }
					: argv.date || argv.d
					? { day: '2-digit' }
					: {}

			console.log(date.toLocaleString('ru-RU', options))
		},
	})
	.help()
	.parse()
