import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import _ from 'lodash'
import axios from 'axios';

const Login = (props) => {

	const [user, setUser] = useState({
		email: '',
		password: '',
		loading: false
	})
	const [errors, setErrors] = useState({})

	const validForSubmission = () => {
		let submitErrors = {}
		const requiredFields = ["password", "email"]
		requiredFields.forEach(field => {
			if(user[field].trim() === ''){
				submitErrors = {
					...submitErrors,
					[field]: `${field} required`
				}
			}
		})
		setErrors(submitErrors)
		return _.isEmpty(submitErrors)
	}

	const handleChange = (event) => {
		setUser({
			...user, [event.target.name]: event.target.value
		})
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		if (validForSubmission()){
			setUser({
				loading: true
			})
			const userData = {
				email: user.email,
				password: user.password
			}
		try {
			await axios.post('/login', userData).then((response) => {
				localStorage.setItem('AuthToken', `Bearer ${response.data.token}`)
				setUser({
					loading: false
				})
				props.history.push('/')
			})
		} catch(error) {
				setUser({
					errors: error.response.data,
					loading: false
				})
			}
		}
	}

	return (
		<>
		<section className='absolute w-full h-full'>
			<div className='container mx-auto px-4 h-full'>
				<div className='flex content-center items-center justify-center h-full'>
					<div className="w-full lg:w-4/12 px-4">
						<div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0'>
							<form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
								<div className="mb-4">
								<label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="email">
									Email
								</label>
								<input 
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
									id="email" 
									name="email"
									type="text"
									placeholder="Email"
									onChange={handleChange}
								/>
								<p className='text-red-400'>{errors.email}</p>
								</div>
								<div className="mb-6">
								<label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="password">
									Password
								</label>
								<input 
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
									id="password" 
									name="password"
									type="password" 
									placeholder="Password"
									onChange={handleChange}
								/>
								<p className='text-red-400'>{errors.password}</p>
								</div>
								<div className="flex flex-wrap items-center justify-between">
								<button 
									className="w-full mb-4 bg-gray-900 active:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg focus:outline-none focus:shadow-outline" 
									type="submit"
								>
									Sign In
								</button>
								<Link className="inline-block align-baseline mx-auto font-bold text-sm text-blue-800 hover:text-blue-600" to='/signup'>
									Don't have an account? Sign Up!
								</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
		</>
	)
}

export default Login
