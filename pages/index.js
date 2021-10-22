import MeetupList from '../components/meetups/MeetupList'

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'title',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    address: 'address 1, ss',
    description: 'bla bla'
  },
  {
    id: 'm2',
    title: 'title',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Thomas_Wolff.jpg',
    address: 'address 1, ss',
    description: 'bla bla'
  }
]

function HomePage() { 
  return <MeetupList meetups={DUMMY_MEETUPS}/>
} 

export default HomePage
