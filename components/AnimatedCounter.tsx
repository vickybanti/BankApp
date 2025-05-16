"use client"
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({amount}:{amount:number}) => {
  return (
    <div>
        <CountUp end={amount}
        duration={2.5}
        decimal=","
        decimals={2}
        prefix="$"
        />
    </div>
  )
}

export default AnimatedCounter