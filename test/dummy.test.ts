import { createIcon } from 'dummy'

it('createIcon working', () => {

    const myIcon = createIcon()

    expect(myIcon.icon_name).toBe('dummy')
})