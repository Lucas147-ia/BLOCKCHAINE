
import './style.css'
import {ethers}from 'ethers'
import ideaChainArtifact from '../contracts/IdeaChain.json'
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
document.querySelector("#app").innerHTML = `
  <header class="topbar">
    <a class="brand" href="#">
      <span class="brand-icon">✳</span>
      IdeaChain
    </a>
    <span class="network-status">
      <span class="status-dot"></span>
      Red de demostración
    </span>
  </header>

  <main class="container">
    <section class="hero">
      <span class="eyebrow">IDEAS QUE DEJAN HUELLA</span>
      <h1>Toda gran idea<br>merece <span>quedar registrada.</span></h1>
      <p>Comparte lo que imaginas. Guarda tus ideas en un solo lugar y conviértelas en el comienzo de algo grande.</p>
    </section>

    <section class="workspace">
      <div class="form-panel">
        <div class="section-heading">
          <span class="heading-icon">+</span>
          <div>
            <h2>Registrar una idea</h2>
            <p>Cuéntanos qué tienes en mente.</p>
          </div>
        </div>

        <form id="idea-form">
          <label for="title">Título de tu idea</label>
          <input id="title" name="title" maxlength=”100”
            placeholder="Ej. Una app para cuidar el planeta” required>

          <label for="description">Descripción</label>
          <textarea id="description" name="description" rows="5"
            maxlength="1000" placeholder=”Explica tu idea y cómo podría ayudar…” required></textarea>

          <button type="submit" class="submit-button">
            Registrar idea <span>↗</span>
          </button>
          <p id="form-message" class="form-message" aria-live="polite"></p>
        </form>
      </div>

      <div class="ideas-panel">
        <div class="ideas-heading">
          <div>
            <span class="eyebrow">EL MURO DE IDEAS</span>
            <h2>Ideas compartidas</h2>
          </div>
          <span class="count" id="idea-count">0 ideas</span>
        </div>

        <div id="idea-list" class="idea-list">
          <div class="empty-state">
            <span class="empty-icon">✧</span>
            <h3>Tu próxima gran idea empieza aquí</h3>
            <p>Cuando registres una idea, aparecerá en esta sección.</p>
          </div>
        </div>
        <p class="demo-note">Versión visual de prueba. En el siguiente paso conectaremos el formulario con el contrato inteligente.</p>
      </div>
    </section>

    <footer>
      <span>✳ IdeaChain</span>
      <span>Proyecto educativo · Blockchain local</span>
    </footer>
  </main>
`

const form = document.querySelector('#idea-form')
const titleInput = document.querySelector('#title')
const descriptionInput = document.querySelector('#description')
const ideaList = document.querySelector('#idea-list')
const ideaCount = document.querySelector('#idea-count')
const message = document.querySelector('#form-message')

const ideas = []
let contract
let signer
async function connectContract(){
  const provider = new
  ethers.JsonRpcProvider('http://127.0.0.1:8545')

  const accounts = await provider.listAccounts()
  signer = await provider.getSigner(0)

  contract = new ethers.Contract(CONTRACT_ADDRESS, ideaChainArtifact.abi, signer)
  message.textContent = 'Conectado a la blockchain local'
}
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const title = titleInput.value.trim()
  const description = descriptionInput.value.trim()

  if (!title || !description) {
    message.textContent = 'Completa el título y la descripción.'
    return
  }

  try {
    if (!contract) {
      await connectContract()
    }

    message.textContent = 'Registrando idea en la blockchain...'

    const tx = await contract.registerIdea(title, description)
    await tx.wait()

    form.reset()
    await loadIdeas()
    message.textContent = '¡Idea registrada en la blockchain!'
  } catch (error) {
    console.error(error)
    message.textContent = 'No se pudo registrar la idea. Revisa la conexión.'
  }
})


function renderIdeas() {
  ideaCount.textContent = `${ideas.length} ${ideas.length === 1 ? 'idea' : 'ideas'}`

  ideaList.replaceChildren()

  if (ideas.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'empty-state'
    empty.textContent = 'Todavía no hay ideas registradas.'
    ideaList.appendChild(empty)
    return
  }

  ideas.forEach((idea,index) => {
    const card = document.createElement('article')
    card.className = 'idea-card'

    const number = document.createElement('span')
    number.className = 'idea-number'
    number.textContent = 'IDEA' + String(ideas.length - index).padStart(2,`0`)

    const heading = document.createElement('h3')
    heading.textContent = idea.title

    const description = document.createElement('p')
    description.textContent = idea.description

    const date = document.createElement('small')
    date.textContent = idea.date

    card.append(number, heading, description, date)
    ideaList.appendChild(card)
  })
}
async function loadIdeas(){
  const count = Number(await contract.getIdeasCount())

  ideas.length = 0
  for (let i = count - 1; i>=0;i--){
    const idea = await contract.getIdea(i)
    ideas.push({ title: idea[1], description: idea[2], date: new Date(Number(idea[4])*
      1000).toLocaleString()
    })
  }
  renderIdeas()
}

connectContract()
.then(()=> loadIdeas())
.catch((error) =>{ console.error('Error al conectar con IdeaChain:', error)
  message.textContent = 'No se pudo conectar con la blockchain local'
})
