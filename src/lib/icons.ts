import listAddIcon from '$lib/assets/list_add_icon.svg';
import listAddIconBlack from '$lib/assets/list_add_icon_black.svg';
import startIcon from '$lib/assets/play_icon.svg';
import resetIcon from '$lib/assets/replay_icon.svg';
import upIcon from '$lib/assets/arrow_up_icon.svg';
import downIcon from '$lib/assets/arrow_down_icon.svg';
import pauseIcon from '$lib/assets/pause_icon.svg';
import deleteIcon from '$lib/assets/close_icon.svg';
import deleteIconBlack from '$lib/assets/close_icon_black.svg';
import listRemoveIcon from '$lib/assets/list_remove_icon.svg';
import infoIcon from '$lib/assets/donators_list_icon.svg';
import plusIcon from '$lib/assets/add_icon.svg';
import plusIconBlack from '$lib/assets/add_icon_black.svg';
import trashcanIcon from '$lib/assets/trashcan_icon.svg';
import visibilityIcon from '$lib/assets/visibility_off_icon.svg';
import bombIcon from '$lib/assets/bomb_icon.svg';
import bombIconBlack from '$lib/assets/bomb_icon_black.svg';
import helpIcon from '$lib/assets/help_icon.svg';
import emeraldIcon from '$lib/assets/emerald_icon.svg';
import moreIcon from '$lib/assets/more_icon.svg';
import editIcon from '$lib/assets/edit_icon.svg';

export type iconTypes =
  | 'listAddItem'
  | 'listRemoveItem'
  | 'start'
  | 'reset'
  | 'upArrow'
  | 'downArrow'
  | 'pause'
  | 'delete'
  | 'info'
  | 'plus'
  | 'trashcan'
  | 'visibility'
  | 'bomb'
  | 'help'
  | 'emerald'
  | 'more'
  | 'edit';

export default function getIcon(icon: iconTypes, color: 'white' | 'black' = 'white') {
  switch (icon) {
    case 'listAddItem':
      return color === 'white' ? listAddIcon : listAddIconBlack;
    case 'listRemoveItem':
      return listRemoveIcon;
    case 'start':
      return startIcon;
    case 'reset':
      return resetIcon;
    case 'upArrow':
      return upIcon;
    case 'downArrow':
      return downIcon;
    case 'pause':
      return pauseIcon;
    case 'delete':
      return color === 'white' ? deleteIcon : deleteIconBlack;
    case 'info':
      return infoIcon;
    case 'trashcan':
      return trashcanIcon;
    case 'visibility':
      return visibilityIcon;
    case 'help':
      return helpIcon;
    case 'emerald':
      return emeraldIcon;
    case 'edit':
      return editIcon;
    case 'bomb':
      return color === 'white' ? bombIcon : bombIconBlack;
    case 'plus':
      return color === 'white' ? plusIcon : plusIconBlack;
    case 'more':
      return moreIcon;
    default:
      return '';
  }
}
