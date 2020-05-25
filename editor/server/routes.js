const path = require('path')
const fs = require('fs')

const express = require('express')
const router = new express.Router()

const PATH_TO_STATE_MODEL = path.resolve(__dirname, '../../lambda/model.json')

function getPathToIaModel(locale = 'en-US') {
  return path.resolve(__dirname, `../../skill-package/interactionModels/custom/${locale}.json`)
}

function getPathToContentModel(locale = 'en-US') {
  return path.resolve(__dirname, `../../lambda/content/${locale}/index.json`)
}

// CONTENT
router.get(['/api/content', '/api/content/:locale'], (req, resp) => {
  const pathToContentModel = getPathToContentModel(req.params.locale)

  fs.readFile(pathToContentModel, 'utf8', (error, model) => {
    if (error) {
      return resp.send({ error })
    }

    resp.send(JSON.parse(model))
  })
})

router.post(['/api/content', '/api/content/:locale'], (req, resp) => {
  const content = JSON.stringify(req.body, null, 2)
  const pathToContentModel = getPathToContentModel(req.params.locale)

  fs.writeFile(pathToContentModel, content, (error) => {
    if (error) {
      return resp.send({ success: false, error })
    }

    resp.send({ success: true })
  })
})

// INTERACTION MODEL
router.get(['/api/ia/model', '/api/ia/model/:locale'], (req, resp) => {
  const pathToIaModel = getPathToIaModel(req.params.locale)

  fs.readFile(pathToIaModel, 'utf8', (error, model) => {
    if (error) {
      return resp.send({ error })
    }

    resp.send(JSON.parse(model))
  })
})

router.post(['/api/ia/model', '/api/ia/model/:locale'], (req, resp) => {
  const model = JSON.stringify(req.body, null, 2)
  const pathToIaModel = getPathToIaModel(req.params.locale)

  fs.writeFile(pathToIaModel, model, (error) => {
    if (error) {
      return resp.send({ success: false, error })
    }

    resp.send({ success: true })
  })
})

// STATE MODEL
router.get('/api/state/model', (req, resp) => {
  fs.readFile(PATH_TO_STATE_MODEL, 'utf8', (error, model) => {
    if (error) {
      return resp.send({ error })
    }

    resp.send(JSON.parse(model))
  })
})

router.post('/api/state/model', (req, resp) => {
  const model = JSON.stringify(req.body, null, 2)

  fs.writeFile(PATH_TO_STATE_MODEL, model, (error) => {
    if (error) {
      return resp.send({ success: false, error })
    }

    resp.send({ success: true })
  })
})

module.exports = router