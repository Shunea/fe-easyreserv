import React, { useContext } from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Context } from '../context';
import "../styles/styles.css"

function ChartPie() {
  const{dashBoardData}=useContext(Context)
    const data = [
      { name: 'Free', value: dashBoardData.tableStatusAtMoment?100-dashBoardData.tableStatusAtMoment:100 },
      { name: 'Busy', value: dashBoardData.tableStatusAtMoment},

    ]
      
      const COLORS = ['#ebfaeb', '#23B121'];
      
      const RADIAN = Math.PI / 180;
      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      };
  return (
         <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
  )
}

export default ChartPie