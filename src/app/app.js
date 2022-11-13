import React, { useRef, useState, useEffect } from 'react';
import './app.scss';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa'
import { ImLocation2 } from 'react-icons/im'
import { MdClose, MdEmail, MdPhone } from 'react-icons/md'
import axios from 'axios'
import Modal from '../components/modal'


// const baseUrl = 'http://127.0.0.1:8000/api/'

const baseUrl = "http://54.254.234.228:31479/api/"


function App() {

  const fileInputRef = useRef()
  const contactUsDivRef = useRef(null)
  const [highlight, setHighlight] = useState(false)
  const [file, setFile] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isError, setError] = useState(false)
  const [heardOptions, setHeardOptions] = useState([])

  const [isFormDirty, setIsFormDirty] = useState(false)

  const [userInfo, setUserInfo] = useState({
    name: '',
    tech_expert: [],
    phone_number: '',
    email: '',
    comments: '',
    heard: '',
    position: ''
  })

  const [tech, setTech] = useState({ tech_name: '', experience: "" })
  
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhoneNumber = (input_str)=>{
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
    return re.test(input_str)
  }

  const isValidForm = () => {
    const { email, tech_expert, phone_number, heard, position, name } = userInfo
    if (!isValidEmail(email)) {
      return false
    }
    if (tech_expert.length === 0) {
      return false
    }
    if (!isValidPhoneNumber(phone_number)) {
      return false
    }
    if (heard.trim().length === 0) {
      return false
    }
    if (position.trim().length === 0) {
      return false
    }
    if (!file) {
      return false
    }
    if (name.trim().length === 0) {
      return false
    }
    return true
  }
  
  const onChooseFile = () => {
    setIsFormDirty(true)
    fileInputRef.current.click()
  }

  const scrollToContactUs = () => {
    if (contactUsDivRef) {
      contactUsDivRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }

  const onFileAdded = (files) => {
    setFile(files[0])
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setHighlight(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setHighlight(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    onFileAdded(files)
    setHighlight(false)
    setIsFormDirty(true)
  }

  const changeHandler = (e) => {
    setIsFormDirty(true)
    setUserInfo({...userInfo, [e.target.name] : e.target.value })
  }

  const techHandler = (e) => {
    setTech({...tech, [e.target.name] : e.target.value })
  }

  const onTechClose = (index) => {
    setIsFormDirty(true)
    const tech_expert = userInfo.tech_expert
      tech_expert.splice(index, 1)
      setUserInfo({ ...userInfo, tech_expert: tech_expert })
  }

  const addTech = () => {
    if (tech.tech_name && tech.experience) {
      const tech_expert = userInfo.tech_expert
      tech_expert.push({ ...tech })
      setUserInfo({ ...userInfo, tech_expert: tech_expert })
      setTech({tech_name: '', experience: "" })
    }
  }

  const submitHandler = (e) => {
    if (!isValidForm()) {
      return 
    }
    e.preventDefault()
    const formdata = new FormData()
    Object.keys(userInfo).forEach(infoKey => {
      let value = userInfo[infoKey]
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }
      formdata.append(infoKey, value)
    })
    formdata.append('upload', file)

    axios.post(baseUrl+'drop/', formdata, {
      headers :{
        'content-type': 'multipart/form-data'
      }
    }).then(res => {
      setUserInfo({
        name: '',
        tech_expert: [],
        phone_number: '',
        email: '',
        comments: '',
        heard: '',
        position: '',
  
      })
      setFile(null)
      setIsModalOpen(true)
      setIsFormDirty(false)
    }).catch(e => {
      setError(true)
      setIsModalOpen(true)
      setIsFormDirty(false)
      console.error(e)
    })
  }

  useEffect(() => {
    axios.get(baseUrl+'refer/').then(res => {
      setHeardOptions(res.data.data)
    })
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__container">
          <img src='./logo.png' className='logo' alt='logo' />
          <div className="nav">
            <p onClick={scrollToContactUs}>Contact Us</p>
          </div>
        </div>
      </header>
      <main className='app-main'>
        <div className="app-main__container">
          <form className="cv-drop-from" onSubmit={submitHandler}>
            <div className="input-control">
              <label htmlFor=""> Full Name </label>
              <input name="name" type="text" placeholder="Example: Kosuke Yoshida" value={userInfo.name} onChange={changeHandler} />
              {
                userInfo.name.trim().length === 0 && isFormDirty ?
                  <span className='error'>Please enter valid name.</span> : null
              }
            </div>

            <div className="input-control">
              <label htmlFor="">Email</label>
              <input required name='email' type="text" placeholder="Example: info.bd@taglog.co.jp" value={userInfo.email} onChange={changeHandler} />
              {
                !isValidEmail(userInfo.email) && isFormDirty ?
                  <span className='error'>Please enter valid email.</span> : null
              }
            </div>
            <div className="input-control">
              <label htmlFor="">Phone Number</label>
              <input required name='phone_number' type="text" placeholder="Example: 017402617XX" value={userInfo.phone_number} onChange={changeHandler} />
              {
                !isValidPhoneNumber(userInfo.phone_number) && isFormDirty ?
                  <span className='error'>Please enter valid phone number.</span> : null
              }
            </div>

            <div className="input-control">
              <label htmlFor="">Years of experience in Techology </label>
              <ul className='tech-list'>
                {
                  userInfo.tech_expert.map((tech, index) => (
                    <li key={index}>
                      <span>{tech.experience}</span>
                      <span>Years in</span>
                      <span>{tech.tech_name} </span>
                      <span><MdClose onClick={()=>onTechClose(index)} size='20' className='close-icon'/></span>
                    </li>
                  ))
                }
              </ul>
              <div className="tech-input-group">
              <input
                  className='experience'
                  placeholder = 'Ex: 2'
                  name='experience'
                  type="text"
                  value={tech.experience}
                  onChange={techHandler}
                />
                <span> Years of Experience in </span>
                <input
                  
                  name='tech_name'
                  placeholder='Ex: Python'
                  type="text"
                  value={tech.tech_name}
                  onChange={techHandler}
                />
                <button
                  className='add-more-button'
                  type='button'
                  onClick={addTech}
                >
                  {userInfo.tech_expert.length > 0 ? 'Add more' : 'Add'}
                </button>
              </div>
              {
                userInfo.tech_expert.length === 0 && isFormDirty ?
                  <span className='error'>You must add at least one skill.</span> : null
              }
            </div>

            <div className="input-control">
              <label htmlFor="">Upload Your CV</label>
              <div
                className={`cv-upload ${highlight ? 'highlight': ''}`}
                onClick={onChooseFile}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <input
                  onChange={(e)=>onFileAdded(e.target.files)}
                  accept='.pdf,.doc,.docx'
                  type='file'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <FaCloudUploadAlt className='upload-icon'/>
                <span>Choose File Or Drop here</span>
              </div>
              <div className='file-preview'>
                {
                  file ? 
                    <span>{file.name}</span> : 
                    isFormDirty ? <span className='error'>Please attach your resume.</span> : null
                }
              </div>
            </div>
            <div className="input-control">
              <label htmlFor="">Message to Hiring Team</label>
              <textarea name="comments" cols="30" rows="10" placeholder="Let the company know about your interest working there" value={userInfo.comments} onChange={changeHandler}></textarea>
            </div>
            <div className="input-control">
              <label htmlFor="">Position applied for</label>
              <input required name='position' type="text" placeholder="Example: Software Engineer" value={userInfo.position} onChange={changeHandler} />
              {
                userInfo.position.trim().length === 0 && isFormDirty ?
                  <span className='error'>Please enter valid position.</span> : null
              }
            </div>
            <div className="input-control">
              <label htmlFor="">How did you hear about us?</label>
              <select name='heard' onChange={changeHandler} value={userInfo.heard}>
                <option value='' >Select</option>
                {
                  heardOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))
                }
              </select>
              {
                userInfo.heard.trim().length === 0 && isFormDirty ?
                  <span className='error'>Please select one option.</span> : null
              }
            </div>

            <div className="button-container">
              <button type={`${isValidForm() ? 'submit': 'button'}`} className={`send-button ${!isValidForm() ? 'disabled': ''}`}>Send CV</button>
            </div>
            <div className="input-control terms">
              <input type="checkbox" />
              <p>By checking this box, you consent to your information being saved and used to reach out to you in relation to your application. This information will not be used for different matters or distributed to third parties. Please check our privacy policy for more in-depth information.</p>
            </div>
          </form>
        </div>
      </main>
      <footer className='app-footer'>
        <div className="app-footer__container">
          <div className="contact-us" ref={contactUsDivRef}>
            <h3>Contact Us</h3>
            <div className="address">
              <p className="location">
                <span>
                  <ImLocation2 className='contact-us-icon' />
                </span>
                <span>東京都世田谷区成城3-15-1</span>
              </p>
              <p className="email">
                <span>
                  <MdEmail className='contact-us-icon' />
                </span>
                <span>info@taglog.co.jp</span>
              </p>
              <p className="phone">
                <span>
                  <MdPhone className='contact-us-icon' />
                </span>
                <span>+81-3-6880-9067</span>
              </p>
              <p className="phone">
                <span>
                  <FaHome className='contact-us-icon' />
                </span>
                <a rel="noopener noreferrer" target="_blank" href="https://next.taglog.co.jp/">next.taglog.co.jp</a>
              </p>
            </div>
          </div>
        </div>
        <div className='copyright'>Copyright © {new Date().getFullYear()} Taglog Next. All Rights Reserved.</div>
      </footer>
      <Modal isOpen={isModalOpen} onClose={() => {
        setError(false)
        setIsModalOpen(false)
      }}>
        <div className="modal-content">
          {
            isError ? 
              <div className="error">
                <h3>Something went wrong</h3>
              </div>
              :
              <>
                <div id="success_tic">
                  <div className="checkmark-circle">
                    <div className="background"/>
                    <div className="checkmark draw" />
                  </div>
                </div>
                <h3 className='title'>Thanks for submitting your CV.</h3>
                <p>We will contact with you if we find a suitable position.</p>
              </>
          }
        </div>
      </Modal>
    </div>
  );
}

export default App;
