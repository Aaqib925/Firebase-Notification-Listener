import React from 'react'

const TextInput = ({
    id = "name",
    title = "Name",
    type = "text",
    placeholder = title,
    handleChange,
    values,
    errors,
    touched
}) => {
    let hasError = touched[`${id}`] && errors[`${id}`];
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{title}</label>
            <input
                onChange={handleChange(`${id}`)}
                value={values[`${id}`]}
                type={type} id={id} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                required
            />
            {
                hasError &&
                <div className='text-red-500 dark:text-red-500 text-sm font-thin '>
                    {errors[`${id}`]}
                </div>
            }

        </div>
    )
}

export default TextInput