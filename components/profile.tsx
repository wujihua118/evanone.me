import Image from 'next/image'
import Link from 'next/link'

import { EmailIcon, GithubIcon } from 'components/icons'

export default function Profile() {
  return (
    <div className="bg-profile sm:-mt-20 -mt-48 sm:px-10 sm:py-9 px-5 py-4 flex sm:flex-row flex-col max-sm:items-center sm:gap-9 gap-4 shadow-profile sm:rounded-[0.625rem]">
      <Image
        priority
        src="/profile.jpeg"
        width={148}
        height={148}
        alt="profile"
        className="sm:rounded-lg rounded-md max-sm:w-12 max-sm:h-12"
      />
      <div className="flex flex-col max-sm:items-center sm:justify-between">
        <h1 className="text-title text-2xl mt-1 font-bold">Evan</h1>
        <p className="text-text mt-2 mb-4 max-sm:text-center">
          Chengdu China
          <br />
          Frontend Developer
          <br />
          Web Designer
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/wujihua118"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-blue"
          >
            <GithubIcon />
            <span className="text-sm">wujihua118</span>
          </Link>
          <Link
            href="mailto:jihua.evan@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-blue"
          >
            <EmailIcon />
            <span className="text-sm">jihua.evan@gmail.com</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
