const HandleTime =(prop) =>{  
  
  
    if(prop.timeFromData !== null){
    const timeData = new Date(prop.timeFromData)
    const currentDate = new Date();
    const diffTime = Math.abs(timeData - currentDate)
    const miliSecDay = 1000 * 60 * 60 * 24;
    const diffDay = parseInt(diffTime / miliSecDay);
    const typeTime = {
      day: diffDay,
      week: parseInt(diffDay/7),
      month: parseInt(diffDay/30),
      year: parseInt(diffDay/365)
    }
    
    if(typeTime.day < 7) return typeTime.day+' hari'
    if(typeTime.week < 4) return typeTime.week+' minggu'
    if(typeTime.month < 12) return typeTime.month+' bulan'
    else return typeTime.year+' tahun'
}
      else return '-'
  
    }
export default HandleTime