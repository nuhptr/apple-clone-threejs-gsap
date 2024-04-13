import { Hero, Highlights, Model, Navbar } from "./components"

export default function App() {
    return (
        <main className="bg-black">
            <Navbar />
            <Hero />
            <Highlights />
            <Model />
        </main>
    )
}
