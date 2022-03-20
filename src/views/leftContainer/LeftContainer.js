import React from 'react'
import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/laptopBrowsingAnimation.json'

const LeftContainer = () => {

    const RenderLottie = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,

        }
        return (
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
            />
        )
    }
    return (
        <div className='flex flex-col flex-1 justify-center items-center text-black-500 dark:text-gray-400 '>
            <RenderLottie />
            <div className="text-center text-2xl font-extrabold">
                Simple Tool for testing your firebase Client Side push notifications
            </div>
        </div>

    )
}

export default LeftContainer