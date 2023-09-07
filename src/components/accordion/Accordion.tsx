import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import PlusIcon from 'assets/svg/general-plus.svg'
import MinusIcon from 'assets/svg/general-minus.svg'

import stl from './Accordion.module.scss'

const Accordion = ({
  title,
  customTitleStyles,
  children,
  customIconNotExpanded,
  customIconIsExpanded,
  showLine = true,
}) => {
  const [isExpanded, setExpanded] = useState(false)

  const notExpandedIcon = customIconNotExpanded || <PlusIcon />
  const isExpandedIcon = customIconIsExpanded || <MinusIcon />

  return (
    <div className={stl.container}>
      {showLine && <div className={stl.line} />}
      <div className={stl.header} onClick={() => setExpanded(!isExpanded)}>
        <span className={clsx(stl.title, customTitleStyles)}>{title}</span>
        {isExpanded ? isExpandedIcon : notExpandedIcon}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={stl.children}
            key="content"
            initial={{ opacity: 0, y: '-10%' }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{
              opacity: 0,
              y: '-10%',
              transition: {
                duration: 0.5,
              },
            }}
          >
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  customTitleStyles: PropTypes.string,
  children: PropTypes.node.isRequired,
  customIconNotExpanded: PropTypes.node,
  customIconIsExpanded: PropTypes.node,
  showLine: PropTypes.bool,
}

export default Accordion
