import React, { Suspense } from 'react'
import classes from './page.module.css'
import Link from 'next/link'
import MealsGrid from '@/components/meals/meals-grid'
import { getMeals } from '@/lib/meals'

async function Meals(){
  const meals = await getMeals()  //without useEffect or any hook we can call the data from db by adding it in lib
  return  <MealsGrid meals={meals}/>
}
const MealsPage = () => {
  return (
    <>
    <header className={classes.header}>
      <h1>
        Delicious meal, created {' '}
        <span className={classes.highlight}>by you</span>
      </h1>
      <p>
      Choose your favourite recipie and cook it!! It is easy and fun!!
      </p>
      <p className={classes.cta}>
        <Link href='/meals/share'>
        Share your favourite recipie
        </Link>
        </p>

    </header>
    <main className={classes.main}>
      <Suspense fallback={<p className={classes.loading}>Loding Meals</p>}>
      <Meals/>

      </Suspense>
    </main >
    </>
  )
}

export default MealsPage