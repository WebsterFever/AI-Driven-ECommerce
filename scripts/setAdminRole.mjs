import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const email = process.argv[2]

if (!email) {
  console.error('Uso: node scripts/setAdminRole.mjs <email>')
  process.exit(1)
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'Variável GOOGLE_APPLICATION_CREDENTIALS não encontrada.\n' +
      'Configure-a com setx (veja a ETAPA 1) e abra um novo terminal antes de rodar este script.',
  )
  process.exit(1)
}

initializeApp({
  credential: applicationDefault(),
})

const auth = getAuth()
const db = getFirestore()

async function setAdminRole(targetEmail) {
  console.log(`Buscando usuário "${targetEmail}" no Firebase Authentication...`)

  let userRecord
  try {
    userRecord = await auth.getUserByEmail(targetEmail)
  } catch {
    console.error(`Nenhum usuário encontrado com o e-mail "${targetEmail}".`)
    console.error('Verifique se essa conta já foi registrada pelo app.')
    process.exit(1)
  }

  const uid = userRecord.uid
  console.log(`Usuário encontrado. uid: ${uid}`)

  const userRef = db.collection('users').doc(uid)
  const userDoc = await userRef.get()

  if (!userDoc.exists) {
    console.error(`O documento users/${uid} não existe no Firestore.`)
    console.error('O usuário precisa ter completado o registro pelo app antes.')
    process.exit(1)
  }

  const currentRole = userDoc.data()?.role
  console.log(`Role atual: "${currentRole}"`)

  await userRef.update({ role: 'admin' })

  console.log(`Sucesso! "${targetEmail}" agora tem role: "admin".`)
}

setAdminRole(email).catch((error) => {
  console.error('Erro inesperado ao promover usuário:', error)
  process.exit(1)
})
