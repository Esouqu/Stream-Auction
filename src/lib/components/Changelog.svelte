<script lang="ts">
	import { changelog } from '$lib/changelog';
	import { formatDate } from '$lib/utils';
</script>

<div class="changelog">
	<div class="medium-title" style="margin-bottom: 24px;">Обновления</div>
	<div class="changelog-inner">
		{#each changelog as section}
			{@const { createdAt, changes } = section}

			<div class="changelog-section">
				<div class="changelog__date medium-title">{formatDate(new Date(createdAt))}</div>
				<div>
					{#each Object.entries(changes) as [title, update]}
						{#if update}
							<div class="changelog-update {title}">
								<ul class="changelog-update-list support-text">
									{#each update as updateText}
										<li>{updateText}</li>
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.changelog {
		position: relative;

		&-inner {
			position: relative;
			padding-left: 40px;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				margin: auto 0;
				border-radius: 4px;
				width: 3px;
				height: calc(100% - 20px);
				display: block;
				align-content: center;
				background-color: var(--outline);
			}
		}

		&-section {
			&:not(:last-child) {
				margin-bottom: 16px;
			}
		}
		&__date {
			position: relative;
			margin-bottom: 16px;

			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: -45px;
				translate: 0 -50%;
				border-radius: 100px;
				width: 13px;
				height: 13px;
				box-shadow: var(--elevation-1);
				background-color: var(--on-surface);
			}
		}
		&-update {
			display: flex;
			flex-direction: column;
			gap: 10px;
			padding: 20px;
			border-radius: 8px;
			box-shadow: var(--elevation-3);

			&:not(:last-child) {
				margin-bottom: 16px;
			}

			&::before {
				font-size: 16px;
				font-weight: 500;
				line-height: 24px;
				letter-spacing: 0.5px;
			}
			&.added {
				color: white;
				background-image: linear-gradient(145deg, rgba(147, 75, 255, 0.6), transparent);

				&::before {
					content: 'Новое';
				}
			}

			&.changed {
				color: white;
				background-image: linear-gradient(145deg, rgba(192, 124, 0, 0.6), transparent);

				&::before {
					content: 'Изменения';
				}
			}

			&.fixed {
				color: white;
				background-image: linear-gradient(145deg, rgba(222, 55, 48, 0.6), transparent);

				&::before {
					content: 'Исправления';
				}
			}

			&-list {
				display: flex;
				flex-direction: column;
				gap: 12px;
				border-radius: 8px;
				padding: 0 20px;
				margin: 0;
				white-space: break-spaces;
			}
		}
	}
</style>
