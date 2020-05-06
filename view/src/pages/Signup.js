import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import axios from 'axios'

const Signup = (props) => {

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        loading: false
    })

    const [errors, setErrors] = useState({})

	const validForSubmission = () => {
		let submitErrors = {}
		const requiredFields = ["firstName", "lastName", "username", "email", "password", "confirmPassword"]
		requiredFields.forEach(field => {
			if(newUser[field].trim() === ''){
				submitErrors = {
					...submitErrors,
					[field]: `Must not be empty`
				}
			}
		})
		setErrors(submitErrors)
		return _.isEmpty(submitErrors)
	}

    const handleChange = (event) => {
        setNewUser({
            ...newUser, [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(validForSubmission()) {
            setNewUser({ loading: true })
            const newUserData = {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword
            }
        try{
            await axios.post('/signup', newUserData).then((response) => {
                localStorage.setItem('AuthToken', `Bearer ${response.data.token}`)
                setNewUser({
                    loading: false
                })
                props.history.push('/')
            })
        } catch(error){
                setNewUser({
                    errors: error.response.data,
                    loading: false
                })
            }
        }
    }   

    return (
        <section className='absolute w-full h-full'>
            <div className='container mx-auto px-4 h-full'>
                <div className='flex content-center items-center justify-center h-full'>
                    <div className='w-full lg:w-6/12 px-4'>
                        <div className='relative flex flex-wrap min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0'>
                            <form className="w-full max-w-lg px-8 pt-8 pb-8 mx-auto mb:4" onSubmit={handleSubmit}>
                                <div className="flex flex-wrap -mx-3">
                                    <div className="w-full md:w-1/2 px-3 mb-2">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-first-name">
                                            First Name
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName"
                                            name='firstName'
                                            type="firstName" 
                                            placeholder="First Name"
                                            onChange={handleChange}
                                        />
                                        <p className='text-red-400 mt-1'>{errors.firstName}</p>
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-last-name">
                                            Last Name
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName"
                                            name='lastName' 
                                            type="text" 
                                            placeholder="Last Name"
                                            onChange={handleChange}
                                            />
                                        <p className='text-red-400 mt-1'>{errors.lastName}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full px-3 mb-2">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-username">
                                            Username
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" 
                                            name='username'
                                            type="username" 
                                            placeholder="Username"
                                            onChange={handleChange}
                                        />
                                        <p className='text-red-400 mt-1'>{errors.username}</p>
                                    </div>
                                    <div className="w-full px-3 mb-2">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-email">
                                            Email Address
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                            id="email" 
                                            name='email'
                                            type="email" 
                                            placeholder="Email Address"
                                            onChange={handleChange}
                                        />
                                        <p className='text-red-400 mt-1'>{errors.email}</p>
                                    </div> 
                                    <div className="w-full px-3 mb-2">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-password">
                                        Password
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" 
                                            name="password"
                                            type="password" 
                                            placeholder="Password"
                                            onChange={handleChange}
                                        />
                                        <p className='text-red-400 mt-1'>{errors.password}</p>
                                    </div>
                                    <div className="w-full px-3 mb-2">
                                        <label className="block uppercase text-gray-700 text-sm font-bold mb-2" htmlFor="grid-password">
                                        Confirm Password
                                        </label>
                                        <input 
                                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" 
                                            name='confirmPassword'
                                            type="password" 
                                            placeholder="Confirm Password"
                                            onChange={handleChange}
                                        />
                                        <p className='text-red-400 mt-1'>{errors.confirmPassword}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between">
								<button 
									className="w-full mb-4 bg-gray-900 active:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow hover:shadow-lg focus:outline-none focus:shadow-outline" 
                                    type="submit"
								>
									Sign Up
								</button>
								<Link className="inline-block align-baseline mx-auto font-bold text-sm text-blue-800 hover:text-blue-600" to='/login'>
									Already have an account? Login
								</Link>
								</div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup