'use client';
import { FaceDetection, FileInputForm } from './client';


function content() {
  // Demo and unit test are placed at component DemoToBeImproved
  // Uncomment following line will enable the demo page
  // return <DemoToBeImproved></DemoToBeImproved>


  return <main className="container space-y-4 py-4">
    <FileInputForm />
    <FaceDetection />
  </main>

}

export default function Home() {
  return <>{content()}</>
}
