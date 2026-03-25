const API_URL = "http://127.0.0.1:8000"
const chatContainer = document.getElementById("chatContainer")
const questionInput = document.getElementById("questionInput")

initializePromptChips()

async function uploadPDF(){

const fileInput = document.getElementById("pdfFile")
const status = document.getElementById("uploadStatus")
const uploadBtn = document.getElementById("uploadBtn")

const file = fileInput.files[0]

if(!file){
status.innerText="Select a file first"
status.classList.remove("upload-status-success")
status.classList.add("upload-status-error")
return
}

const formData = new FormData()
formData.append("file",file)

status.innerText="Uploading..."
status.classList.remove("upload-status-error","upload-status-success")
uploadBtn.disabled = true

try{
const response = await fetch(`${API_URL}/upload`,{
method:"POST",
body:formData
})

if(!response.ok){
throw new Error("Upload failed")
}

const data = await response.json()

status.innerText=data.message
status.classList.remove("upload-status-error")
status.classList.add("upload-status-success")
}
catch(error){
status.innerText="Unable to upload document. Please try again."
status.classList.remove("upload-status-success")
status.classList.add("upload-status-error")
}
finally{
uploadBtn.disabled = false
}
}

async function askQuestion(){

const input=document.getElementById("questionInput")
const sendBtn=document.getElementById("sendBtn")

const question=input.value.trim()

if(!question) return

addMessage(question,"user")

input.value=""

const thinkingMessage = addMessage("Thinking...","bot",true)
sendBtn.disabled = true
input.disabled = true

try{
const response=await fetch(`${API_URL}/ask`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
question:question
})
})

if(!response.ok){
throw new Error("Question request failed")
}

const data=await response.json()

thinkingMessage.remove()

addMessage(data.answer,"bot")
}
catch(error){
thinkingMessage.remove()
addMessage("Sorry, I couldn't fetch an answer right now. Please try again.","bot")
}
finally{
sendBtn.disabled = false
input.disabled = false
input.focus()
}
}

function addMessage(text,type,isThinking=false){

toggleEmptyState(false)

const msg=document.createElement("div")

msg.classList.add("message",type)

if(isThinking){
msg.classList.add("thinking")
}

const content=document.createElement("div")
content.className = "message-content"
content.innerText=text

const meta=document.createElement("small")
meta.className="message-meta"
meta.innerText=`${type === "user" ? "You" : "Assistant"} • ${formatTime(new Date())}`

msg.appendChild(content)
msg.appendChild(meta)

chatContainer.appendChild(msg)

chatContainer.scrollTop=chatContainer.scrollHeight

return msg
}

document.getElementById("questionInput").addEventListener("keydown",function(event){
if(event.key==="Enter"){
event.preventDefault()
askQuestion()
}
})

function formatTime(date){
return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function toggleEmptyState(show){
const emptyState = document.getElementById("emptyState")
if(!emptyState) return
emptyState.style.display = show ? "block" : "none"
}

function initializePromptChips(){
const chips = document.querySelectorAll(".prompt-chip")

chips.forEach((chip) => {
chip.addEventListener("click",() => {
const prompt = chip.dataset.prompt || ""
questionInput.value = prompt
questionInput.focus()
})
})
}