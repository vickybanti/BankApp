"use client"
import React from 'react'
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJs.register(ArcElement, Tooltip, Legend)
const DoughnutChart = ({accounts}: DoughnutChartProps) => {
    const accountNames = accounts.map((a) => a.name);
    const balances = accounts.map((a) => a.currentBalance)
    const data = {
        datasets: [
        {
            label: 'Banks',
            data: balances,
            backgroundColor: ['#0747b5', '#02265d8', '#2f91fa'],
            borderWidth: 1,
        },
        ],
         labels:accountNames,

    }
  return <Doughnut data={data} 
    options={{
        cutout:'60%',
        plugins: {
            legend: {
                display: false,
            },
            
            
        }
    }}
  />
}

export default DoughnutChart