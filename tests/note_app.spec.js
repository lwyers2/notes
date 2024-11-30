const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')


describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })
  test('front page can be opened', async ({ page }) => {

    const locator = await page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in '}).click() 
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login '}).click()

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged-in')).not.toBeVisible()


  })

  test('user can log in', async ({ page }) => {

    //await page.getByRole('button', { name: 'log in'}).click()
    // const textboxes = await page.getByRole('textbox').all()
    // await textboxes[0].fill('mluukkai')
    // await textboxes[1].fill('salainen')

    // await page.getByRole('textbox'.first().fill('mluukai'))
    // await page.getByRole('textbox'.last().fill('salainen'))

    // await page.getByTestId('username').fill('mluukkai')
    // await page.getByTestId('password').fill('salainen')
    // await page.getByRole('button', { name: 'login'}).click()

    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible()
  })



  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // await page.getByRole('button', { name: 'log in' }).click()
      // await page.getByTestId('username').fill('mluukkai')
      // await page.getByTestId('password').fill('salainen')
      // await page.getByRole('button', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      // await page.getByRole('button', {name: 'new note'}).click()
      // await page.getByRole('textbox').fill('a note created by playwright')
      // await page.getByRole('button', {name: 'save' }).click()
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        // await page.getByRole('button', {name: 'new note' }).click()
        // await page.getByRole('textbox').fill('another note by playwright')
        // await page.getByRole('button', { name: 'save' }).click()
        await createNote(page, 'first note', true)
        await createNote(page, 'second note', true)
        await createNote(page, 'third note', true)
      })

      test('importance can be changed', async ({ page }) => {
        const otherNoteText = await page.getByText('second note')
        const otherNoteElement = await otherNoteText.locator('..')

      await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })

        test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        const otherNoteText = await page.getByText('first note')
        const otherNoteElement = await otherNoteText.locator('..')

        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })

    })
  })
})
