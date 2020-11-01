import React from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import './modal.scss'
import { MdClose } from 'react-icons/md'


const Modal = ({ children, onClose, isOpen }) => {
	if (!isOpen) return null
	return createPortal(
		<>
			<div id='modal-overlay'/>
			<div id='cv-modal'>
				<MdClose className="close-icon" size='42' onClick={onClose}/>
				{children}
			</div>
		</>,
		document.getElementById('modal-root')
	)
}

Modal.defaultProps = {
	onClose: () => { },
	isOpen: false
}

Modal.propTypes = {
	onClose: PropTypes.func.isRequired,
	isOpen: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.node,
		PropTypes.arrayOf(PropTypes.node)
	])
}

export default Modal
