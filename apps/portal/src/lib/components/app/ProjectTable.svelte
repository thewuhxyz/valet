<script lang="ts">
	import {
		createTable,
		Render,
		Subscribe,
		createRender,
	} from "svelte-headless-table"
	import * as Table from "$lib/components/ui/table"
	import { RowActions, CopyCell, Avatar } from "$lib/components/app/index"
	import { user } from "$lib/stores/user-store"
	import AddNew from "./CreateProject.svelte"
	import { projectData } from "$lib/stores"
	import SignOutButton from "./SignOutButton.svelte"

	const table = createTable(projectData)
	const columns = table.createColumns([
		table.column({
			id: "name",
			header: "Name",
			accessor: "name",
		}),
		table.column({
			id: "project-id",
			header: "Project ID",
			accessor: "id",
			cell: ({ value }) => {
				return createRender(CopyCell, {
					text: value || "No Value?",
				})
			},
		}),
		table.column({
			id: "project-secret",
			header: "Project Secret",
			accessor: "secret",
			cell: ({ value }) => {
				return createRender(CopyCell, {
					hidden: true,
					text: value || "No Value?",
				})
			},
		}),
		table.column({
			id: "domain",
			header: "Domain",
			accessor: "domain",
		}),
		table.display({
			id: "actions",
			header: "",
			cell: ({ row }) => {
				if (row.isData() && row.original) {
					return createRender(RowActions, {
						project: row.original,
					})
				}
				return ""
			},
		}),
	])

	const tableModel = table.createViewModel(columns)

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableModel
</script>

<section class="my-16">
	<div class="text-right italic flex flex-col w-[240px] mx-auto">
		<img
			src="/valet-hero-logo-white.svg"
			alt="valet-hero-logo-white"
			width="240"
		/>
		<p class="text-lg pr-4">Developer Portal</p>
	</div>
</section>

{#if $user}
	<section class="flex max-w-6xl my-2 mx-auto items-center justify-between">
		<div class="flex p-2 space-x-2 items-center text-xl">
			<Avatar />
			<p>{$user.name}'s Projects</p>
			<SignOutButton />
		</div>
		<AddNew />
	</section>

	<section class="space-y-4">
		<div class="rounded-md border max-w-6xl mx-auto">
			<Table.Root {...$tableAttrs}>
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe
										attrs={cell.attrs()}
										let:attrs
										props={cell.props()}
										let:props
									>
										<Table.Head {...attrs}>
											<Render of={cell.render()} />
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
				<Table.Body {...$tableBodyAttrs}>
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</section>
{/if}
