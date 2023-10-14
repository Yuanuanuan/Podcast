import { useEffect } from 'react';

import arrow from '../icons/arrow.svg';

const Carousel = ({ img, imgShadow, title, describe, className, slide, setSlide }) => {

  const handleClick = (e) => {
    if (e.target.className === 'left-arrow') {
      if (slide === 1) {
        return setSlide(3)
      }
      return setSlide(prevSlick => prevSlick -= 1);
    }
    if (e.target.className === 'right-arrow') {
      if (slide === 3) {
        return setSlide(1)
      }
      return setSlide(prevSlide => prevSlide += 1);
    }
    
  }

  const handleClickSlide = (e) => {
    if (e.target.className.includes('slide1')) {
      setSlide(1)
    } else if (e.target.className.includes('slide2')) {
      setSlide(2)
    } else if (e.target.className.includes('slide3')) {
      setSlide(3)
    }
  }

  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (slide === 3) {
        return setSlide(1)
      } else if (slide === 2) {
        return setSlide(3)
      } else if (slide === 1) {
        return setSlide(2)
      }
    }, 2000)

    return () => {
      clearInterval(autoSlide);
    }
  }, [setSlide, slide])

  return (
    <div className={className}>
      <div className='title-img-wrapper'>
        <img src={img} alt='' className='title-img'/>
        <img src={imgShadow} alt="" className='title-img-shadow' />
      </div>
      <h2>{title}</h2>
      <h3>{describe}</h3>
      <div className="slides">
        <div className={slide === 1 ? 'slide1 active' : 'slide1'} onClick={(e) => handleClickSlide(e)}></div>
        <div className={slide === 2 ? 'slide2 active' : 'slide2'} onClick={(e) => handleClickSlide(e)}></div>
        <div className={slide === 3 ? 'slide3 active' : 'slide3'} onClick={(e) => handleClickSlide(e)}></div>
      </div>
      <div className="left-arrow" onClick={(e) => handleClick(e)} >
        <img src={arrow} alt="left-arrow" />
      </div>
      <div className="right-arrow" onClick={(e) => handleClick(e)} >
        <img src={arrow} alt="right-arrow" />
      </div>
    </div>
  )
}

export default Carousel;