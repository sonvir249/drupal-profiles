import { useState, useEffect } from 'react'

const API_URL = 'https://www.drupal.org/api-d7'

export default function Organization() {
  return (
    <>
      <input
        aria-label="organization"
        type="text"
        placeholder="organization"
        value=""
        onChange=""
        name="Organization"
      />
    </>
  )
}
