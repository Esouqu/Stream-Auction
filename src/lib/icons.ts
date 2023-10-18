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
import trashcan from '$lib/assets/trashcan_icon.svg';

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
  | 'trashcan';

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
      return trashcan;
    case 'plus':
      return color === 'white' ? plusIcon : plusIconBlack;
    default:
      return '';
  }
}
