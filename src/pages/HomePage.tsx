import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/debounce'
import {
	useLazyGetUserReposQuery,
	useSearchUsersQuery,
} from '../store/github/github.api'
import RepoCard from '../components/RepoCard'

const HomePage = () => {
	const [search, setSearch] = useState('')
	const [dropdouwn, setDropdouwn] = useState(false)
	const debounced = useDebounce(search)
	const { isLoading, isError, data } = useSearchUsersQuery(debounced, {
		skip: debounced.length < 3,
		refetchOnFocus: true,
	})
	const [fetchRepos, { isLoading: areReposLoading, data: repos }] =
		useLazyGetUserReposQuery()
	useEffect(() => {
		setDropdouwn(debounced.length > 3 && data?.length! > 0)
	}, [debounced, data])
	const clickHandler = (username: string) => {
		fetchRepos(username)
		setDropdouwn(false)
	}
	return (
		<div className='flex justify-center pt-10 mx-auto h-screen w-screen'>
			{isError && (
				<p className='text-center text-red-600'>something went wrong...</p>
			)}
			<div className='relative w-[560px]'>
				<input
					type='text'
					className='border py-2 px-4 w-full h-11 mb-2'
					placeholder='Search for Github username...'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				{dropdouwn && (
					<ul className='absolute top-[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white'>
						{isLoading && <p>Loading...</p>}
						{data?.map(user => (
							<li
								onClick={() => clickHandler(user.login)}
								className='py-2 px-2 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer'
								key={user.id}
							>
								{user.login}
							</li>
						))}
					</ul>
				)}
			<div>
				{areReposLoading&& <p>Repos are loading</p>}
				{repos?.map(repo => <RepoCard repo={repo} key={repo.id}/>)}
			</div>
			</div>
		</div>
	)
}

export default HomePage
