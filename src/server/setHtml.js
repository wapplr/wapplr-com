import Head from './Head';

export default function setContents(p = {}) {

    const {wapp} = p;

    wapp.contents.addComponent({
        head: Head
    })

}
